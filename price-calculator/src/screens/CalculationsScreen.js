import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

export default function CalculationsScreen({ navigation }) {
  const { theme } = useTheme();
  const { calculations } = useData();
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const openDetails = (calculation) => {
    setSelectedCalculation(calculation);
    setModalVisible(true);
  };

  const renderCalculation = ({ item }) => (
    <TouchableOpacity
      style={[styles.calculationCard, { backgroundColor: theme.card, ...theme.shadow }]}
      onPress={() => openDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
          {item.productName}
        </Text>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {formatDate(item.date)}
        </Text>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Custo Base:</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {formatCurrency(item.baseCost)}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Lucro ({item.profitPercentage.toFixed(1)}%):
          </Text>
          <Text style={[styles.value, { color: theme.success }]}>
            {formatCurrency(item.profit)}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Imposto:</Text>
          <Text style={[styles.value, { color: theme.secondary }]}>
            {formatCurrency(item.tax)}
          </Text>
        </View>
        
        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.labelBold, { color: theme.text }]}>Preço Final:</Text>
          <Text style={[styles.finalPrice, { color: theme.primary }]}>
            {formatCurrency(item.finalPrice)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calculator-outline" size={80} color={theme.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        Nenhum cálculo realizado
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Os cálculos aparecerão aqui quando você salvar produtos
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Histórico de Cálculos</Text>
      </View>

      {/* Calculations List */}
      <FlatList
        data={calculations}
        renderItem={renderCalculation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          calculations.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      />

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Detalhes do Cálculo
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            {selectedCalculation && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.detailCard, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.detailTitle, { color: theme.text }]}>
                    {selectedCalculation.productName}
                  </Text>
                  <Text style={[styles.detailDate, { color: theme.textSecondary }]}>
                    {formatDate(selectedCalculation.date)}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Informações do Produto
                  </Text>
                  
                  {selectedCalculation.details && (
                    <>
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                          Custo do Produto:
                        </Text>
                        <Text style={[styles.detailValue, { color: theme.text }]}>
                          {formatCurrency(selectedCalculation.details.cost)}
                        </Text>
                      </View>

                      {selectedCalculation.details.additionalCosts?.length > 0 && (
                        <>
                          <Text style={[styles.subsectionTitle, { color: theme.text }]}>
                            Custos Adicionais:
                          </Text>
                          {selectedCalculation.details.additionalCosts.map((cost, index) => (
                            <View key={index} style={styles.detailRow}>
                              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                                {cost.name}:
                              </Text>
                              <Text style={[styles.detailValue, { color: theme.text }]}>
                                {formatCurrency(parseFloat(cost.value))}
                              </Text>
                            </View>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Cálculo Final
                  </Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Custo Base Total:
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>
                      {formatCurrency(selectedCalculation.baseCost)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Margem de Lucro:
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.success }]}>
                      {formatCurrency(selectedCalculation.profit)} ({selectedCalculation.profitPercentage.toFixed(1)}%)
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                      Imposto:
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.secondary }]}>
                      {formatCurrency(selectedCalculation.tax)}
                    </Text>
                  </View>
                  
                  <View style={[styles.detailRow, styles.totalDetailRow]}>
                    <Text style={[styles.detailLabelBold, { color: theme.text }]}>
                      Preço Final:
                    </Text>
                    <Text style={[styles.detailPriceFinal, { color: theme.primary }]}>
                      {formatCurrency(selectedCalculation.finalPrice)}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  calculationCard: {
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
  },
  cardHeader: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
  },
  cardContent: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  label: {
    fontSize: 14,
  },
  labelBold: {
    fontSize: 15,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  detailCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailDate: {
    fontSize: 13,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalDetailRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailLabelBold: {
    fontSize: 15,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailPriceFinal: {
    fontSize: 20,
    fontWeight: '700',
  },
});